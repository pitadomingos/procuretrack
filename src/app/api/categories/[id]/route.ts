
import { NextResponse } from 'next/server';
import { pool } from '../../../../../backend/db.js';
import type { Category } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const idParam = params.id;
  console.log(`[API_INFO] /api/categories/${idParam} GET: Received request.`);
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    console.warn(`[API_WARN] /api/categories/${idParam} GET: Invalid Category ID format.`);
    return NextResponse.json({ error: 'Invalid Category ID format' }, { status: 400 });
  }

  try {
    console.log(`[API_INFO] /api/categories/${id} GET: Executing query to fetch category.`);
    const [rows]: any[] = await pool.execute('SELECT id, category FROM Category WHERE id = ?', [id]);
    if (rows.length === 0) {
      console.warn(`[API_WARN] /api/categories/${id} GET: Category not found.`);
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    console.log(`[API_INFO] /api/categories/${id} GET: Successfully fetched category:`, rows[0]);
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error(`[API_ERROR] /api/categories/${id} GET: Error fetching category:`, error);
    return NextResponse.json({ error: 'Failed to fetch category', details: error.message, code: error.code || 'UNKNOWN_DB_ERROR' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const idParam = params.id;
  console.log(`[API_INFO] /api/categories/${idParam} PUT: Received request.`);
  let requestBody;
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    console.warn(`[API_WARN] /api/categories/${idParam} PUT: Invalid Category ID format.`);
    return NextResponse.json({ error: 'Invalid Category ID format' }, { status: 400 });
  }

  try {
    requestBody = await request.json();
    console.log(`[API_INFO] /api/categories/${id} PUT: Request body:`, requestBody);
    const { category: categoryName } = requestBody as Pick<Category, 'category'>;

    if (!categoryName || typeof categoryName !== 'string' || categoryName.trim() === '') {
      console.warn(`[API_WARN] /api/categories/${id} PUT: Validation failed - Category name is required.`);
      return NextResponse.json({ error: 'Category name is required and must be a non-empty string.' }, { status: 400 });
    }

    const trimmedCategoryName = categoryName.trim();
    const query = `UPDATE Category SET category = ? WHERE id = ?`;
    console.log(`[API_INFO] /api/categories/${id} PUT: Executing query: ${query} with values: ["${trimmedCategoryName}", ${id}]`);
    
    const [result]: any[] = await pool.execute(query, [trimmedCategoryName, id]);
    console.log(`[API_INFO] /api/categories/${id} PUT: Database update result:`, result);

    if (result.affectedRows === 0) {
      console.warn(`[API_WARN] /api/categories/${id} PUT: Category not found or no changes made.`);
      return NextResponse.json({ error: 'Category not found or no changes made' }, { status: 404 });
    }
    
    const [updatedCategoryRows]: any[] = await pool.execute('SELECT id, category FROM Category WHERE id = ?', [id]);
    if (updatedCategoryRows.length === 0) {
      console.error(`[API_ERROR] /api/categories/${id} PUT: Category updated but failed to retrieve it for response.`);
      return NextResponse.json({ error: 'Category updated but failed to retrieve.' }, { status: 500 });
    }
    console.log(`[API_INFO] /api/categories/${id} PUT: Successfully updated and retrieved category:`, updatedCategoryRows[0]);
    return NextResponse.json(updatedCategoryRows[0]);

  } catch (error: any) {
    console.error(`[API_ERROR] /api/categories/${id} PUT: Unhandled exception during category update. Request body was:`, requestBody, 'Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      console.warn(`[API_WARN] /api/categories/${id} PUT: Duplicate entry for category name.`);
      return NextResponse.json({ error: 'Category with this name already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update category', details: error.message, code: error.code || 'UNKNOWN_SERVER_ERROR' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const idParam = params.id;
  console.log(`[API_INFO] /api/categories/${idParam} DELETE: Received request.`);
  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    console.warn(`[API_WARN] /api/categories/${idParam} DELETE: Invalid Category ID format.`);
    return NextResponse.json({ error: 'Invalid Category ID format' }, { status: 400 });
  }

  try {
    console.log(`[API_INFO] /api/categories/${id} DELETE: Executing query to delete category.`);
    const [result]: any[] = await pool.execute('DELETE FROM Category WHERE id = ?', [id]);
    console.log(`[API_INFO] /api/categories/${id} DELETE: Database delete result:`, result);

    if (result.affectedRows === 0) {
      console.warn(`[API_WARN] /api/categories/${id} DELETE: Category not found.`);
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    console.log(`[API_INFO] /api/categories/${id} DELETE: Successfully deleted category.`);
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`[API_ERROR] /api/categories/${id} DELETE: Error deleting category:`, error);
     if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        console.warn(`[API_WARN] /api/categories/${id} DELETE: Attempted to delete a referenced category.`);
        return NextResponse.json({ error: 'Cannot delete category. It is currently referenced by other records (e.g., PO Items, Requisition Items). Please remove those references first.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to delete category', details: error.message, code: error.code || 'UNKNOWN_DB_ERROR' }, { status: 500 });
  }
}
