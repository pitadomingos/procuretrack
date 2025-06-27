
import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../../backend/db.js';
import type { User, UserSiteAccessDisplay } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  let connection;
  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    const [userRows]: any[] = await pool.execute('SELECT * FROM User WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const user = userRows[0] as User;

    const [siteAccessRows]: any[] = await connection.execute(`
      SELECT usa.userId, usa.siteId, s.name as siteName, s.siteCode 
      FROM UserSiteAccess usa
      JOIN Site s ON usa.siteId = s.id
      WHERE usa.userId = ?
    `, [id]);
    
    const assignedSites = siteAccessRows
        .map((access: UserSiteAccessDisplay) => access.siteCode || access.siteName || `SiteID:${access.siteId}`);
    
    return NextResponse.json({ ...user, siteAccess: assignedSites.length > 0 ? assignedSites : ['N/A'] });

  } catch (error: any) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch user', details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const pool = await getDbPool();
    const userData = await request.json() as Omit<User, 'id' | 'siteAccess'>;

    if (!userData.name) {
      return NextResponse.json({ error: 'User name is required.' }, { status: 400 });
    }

    const query = `
      UPDATE User 
      SET name = ?, email = ?, role = ?, isActive = ?
      WHERE id = ?
    `;
    const [result]: any[] = await pool.execute(query, [
      userData.name,
      userData.email || null,
      userData.role || null,
      typeof userData.isActive === 'boolean' ? userData.isActive : true,
      id
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'User not found or no changes made' }, { status: 404 });
    }
    
    // Fetch the updated user to return it (siteAccess logic similar to GET)
    const [updatedUserRows]: any[] = await pool.execute('SELECT * FROM User WHERE id = ?', [id]);
    if (updatedUserRows.length === 0) {
         return NextResponse.json({ error: 'User updated but failed to retrieve.' }, { status: 500 });
    }
    // For simplicity, siteAccess is not updated here. It requires separate logic.
    return NextResponse.json({ ...updatedUserRows[0], siteAccess: ['N/A (Manage separately)'] });

  } catch (error: any) {
    console.error(`Error updating user with ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to update user', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  let connection;
  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // First, delete entries from UserSiteAccess if any
    await connection.execute('DELETE FROM UserSiteAccess WHERE userId = ?', [id]);
    
    // Then, delete the user
    const [result]: any[] = await connection.execute('DELETE FROM User WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await connection.commit();
    return NextResponse.json({ message: 'User and associated site access deleted successfully' }, { status: 200 });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error(`Error deleting user with ID ${id}:`, error);
     if (error.code === 'ER_ROW_IS_REFERENCED_2') { // This might occur if other tables reference User directly
        return NextResponse.json({ error: 'Cannot delete user. They are currently referenced by other records (e.g., Purchase Orders, Fuel Records). Please reassign or remove those references first.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to delete user', details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
