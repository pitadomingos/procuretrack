
import { getDbPool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';
import type { Category } from '@/types';

export async function GET() {
  console.log('[API_INFO] /api/categories GET: Received request.');
  try {
    const pool = await getDbPool();
    const [rows] = await pool.execute('SELECT id, category FROM Category ORDER BY category ASC');
    console.log(`[API_INFO] /api/categories GET: Successfully fetched ${Array.isArray(rows) ? rows.length : 0} categories.`);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('[API_ERROR] /api/categories GET: Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories', details: error.message, code: error.code || 'UNKNOWN_DB_ERROR' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log('[API_INFO] /api/categories POST: Received request.');
  let requestBody;
  try {
    const pool = await getDbPool();
    requestBody = await request.json();
    console.log('[API_INFO] /api/categories POST: Request body:', requestBody);
    const { category: categoryName } = requestBody as Pick<Category, 'category'>;

    if (!categoryName || typeof categoryName !== 'string' || categoryName.trim() === '') {
      console.warn('[API_WARN] /api/categories POST: Validation failed - Category name is required.');
      return NextResponse.json({ error: 'Category name is required and must be a non-empty string.' }, { status: 400 });
    }
    
    const trimmedCategoryName = categoryName.trim();
    const query = `INSERT INTO Category (category) VALUES (?)`;
    console.log(`[API_INFO] /api/categories POST: Executing query: ${query} with values: ["${trimmedCategoryName}"]`);
    
    const [result]: any[] = await pool.execute(query, [trimmedCategoryName]);
    console.log('[API_INFO] /api/categories POST: Database insert result:', result);

    const insertId = result.insertId;
    if (!insertId || insertId === 0) { 
        console.error(`[API_ERROR] /api/categories POST: Category created but failed to retrieve valid ID. insertId: ${insertId}. This might indicate a schema issue (e.g., 'id' column not AUTO_INCREMENT).`);
        return NextResponse.json({ error: 'Category created but failed to retrieve a valid ID. Check server logs and database schema.', details: `insertId was ${insertId}` }, { status: 500 });
    }
    console.log(`[API_INFO] /api/categories POST: New category insertId: ${insertId}`);
    
    const [newCategoryRows]: any[] = await pool.execute('SELECT id, category FROM Category WHERE id = ?', [insertId]);
     if (newCategoryRows.length === 0) {
        console.error(`[API_ERROR] /api/categories POST: Category created (ID: ${insertId}) but failed to retrieve it for response.`);
        return NextResponse.json({ error: 'Category created but failed to retrieve for response.' }, { status: 500 });
    }
    console.log('[API_INFO] /api/categories POST: Successfully created and retrieved new category:', newCategoryRows[0]);
    return NextResponse.json(newCategoryRows[0], { status: 201 });

  } catch (error: any) {
    console.error('[API_ERROR] /api/categories POST: Unhandled exception during category creation. Request body was:', requestBody, 'Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      console.warn('[API_WARN] /api/categories POST: Duplicate entry for category.');
      return NextResponse.json({ error: 'Category with this name already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create category due to a server error.', details: error.message, code: error.code || 'UNKNOWN_SERVER_ERROR' }, { status: 500 });
  }
}
