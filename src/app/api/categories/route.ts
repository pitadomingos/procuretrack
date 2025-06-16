
import { pool } from '../../../../backend/db.js';
import { NextResponse } from 'next/server';
import type { Category } from '@/types';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT id, category FROM Category ORDER BY category ASC');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { category: categoryName } = await request.json() as Pick<Category, 'category'>;

    if (!categoryName || typeof categoryName !== 'string' || categoryName.trim() === '') {
      return NextResponse.json({ error: 'Category name is required and must be a non-empty string.' }, { status: 400 });
    }
    
    const query = `INSERT INTO Category (category) VALUES (?)`;
    const [result]: any[] = await pool.execute(query, [categoryName.trim()]);

    const insertId = result.insertId;
    if (!insertId) {
        return NextResponse.json({ error: 'Category created but failed to retrieve ID.' }, { status: 500 });
    }
    
    const [newCategoryRows]: any[] = await pool.execute('SELECT id, category FROM Category WHERE id = ?', [insertId]);
     if (newCategoryRows.length === 0) {
        return NextResponse.json({ error: 'Category created but failed to retrieve.' }, { status: 500 });
    }
    return NextResponse.json(newCategoryRows[0], { status: 201 });

  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === 'ER_DUP_ENTRY') { // Assuming category name should be unique if you add a unique constraint
      return NextResponse.json({ error: 'Category with this name already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create category', details: error.message }, { status: 500 });
  }
}
