
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { Category } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid Category ID format' }, { status: 400 });
  }

  try {
    const [rows]: any[] = await pool.execute('SELECT id, category FROM Category WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error(`Error fetching category with ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch category', details: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid Category ID format' }, { status: 400 });
  }

  try {
    const { category: categoryName } = await request.json() as Pick<Category, 'category'>;

    if (!categoryName || typeof categoryName !== 'string' || categoryName.trim() === '') {
      return NextResponse.json({ error: 'Category name is required and must be a non-empty string.' }, { status: 400 });
    }

    const query = `UPDATE Category SET category = ? WHERE id = ?`;
    const [result]: any[] = await pool.execute(query, [categoryName.trim(), id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Category not found or no changes made' }, { status: 404 });
    }
    
    const [updatedCategoryRows]: any[] = await pool.execute('SELECT id, category FROM Category WHERE id = ?', [id]);
    if (updatedCategoryRows.length === 0) {
      return NextResponse.json({ error: 'Category updated but failed to retrieve.' }, { status: 500 });
    }
    return NextResponse.json(updatedCategoryRows[0]);

  } catch (error: any) {
    console.error(`Error updating category with ID ${id}:`, error);
    if (error.code === 'ER_DUP_ENTRY') { // Assuming category name should be unique if you add a unique constraint
      return NextResponse.json({ error: 'Category with this name already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update category', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid Category ID format' }, { status: 400 });
  }

  try {
    const [result]: any[] = await pool.execute('DELETE FROM Category WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting category with ID ${id}:`, error);
     if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return NextResponse.json({ error: 'Cannot delete category. It is currently referenced by other records (e.g., PO Items, Requisition Items). Please remove those references first.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to delete category', details: error.message }, { status: 500 });
  }
}
