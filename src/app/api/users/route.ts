
import { getDbPool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';
import type { User, UserSiteAccessDisplay } from '@/types';

export async function GET() {
  let connection;
  try {
    const pool = await getDbPool();
    connection = await pool.getConnection();
    const [users]: any[] = await connection.execute('SELECT * FROM User ORDER BY name ASC');
    
    const [siteAccessRows]: any[] = await connection.execute(`
      SELECT usa.userId, usa.siteId, s.name as siteName, s.siteCode 
      FROM UserSiteAccess usa
      JOIN Site s ON usa.siteId = s.id
    `);

    const usersWithSiteAccess = users.map((user: User) => {
      const assignedSites = siteAccessRows
        .filter((access: UserSiteAccessDisplay) => access.userId === user.id)
        .map((access: UserSiteAccessDisplay) => access.siteCode || access.siteName || `SiteID:${access.siteId}`);
      return {
        ...user,
        siteAccess: assignedSites.length > 0 ? assignedSites : ['N/A'],
      };
    });

    return NextResponse.json(usersWithSiteAccess);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users', details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request: Request) {
  try {
    const pool = await getDbPool();
    const userData = await request.json() as User; // siteAccess will not be processed here

    if (!userData.id || !userData.name) {
      return NextResponse.json({ error: 'User ID and Name are required.' }, { status: 400 });
    }
    
    const query = `
      INSERT INTO User (id, name, email, role, isActive)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.execute(query, [
      userData.id,
      userData.name,
      userData.email || null,
      userData.role || null,
      typeof userData.isActive === 'boolean' ? userData.isActive : true,
    ]);

    // For site access, it would require separate logic for UserSiteAccess table,
    // which is complex for a simple POST. This is typically handled in a more detailed user management UI.

    const [newUserRows]: any[] = await pool.execute('SELECT * FROM User WHERE id = ?', [userData.id]);
    if (newUserRows.length === 0) {
        return NextResponse.json({ error: 'User created but failed to retrieve.' }, { status: 500 });
    }
    // Return user without siteAccess details from this basic POST
    return NextResponse.json({ ...newUserRows[0], siteAccess: ['N/A (Manage separately)'] }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'User with this ID already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create user', details: error.message }, { status: 500 });
  }
}
