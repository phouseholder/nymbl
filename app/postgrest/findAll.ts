import { type Database, tableUrl } from "./database";
import get from "./network/get";
import { type IModelField } from "~/models";

/**
 * Fetches all rows from the specified table in the PostgreSQL database.
 * Uses PostgREST for querying the database.
 *
 * @template T - The table name, which must be a key of the Database's Tables.
 * @param {T} table - The name of the table to query.
 * @param {string} [options] - Additional query options as a string.
 * @param {IModelField[]} [fields] - Optional array of model fields to determine list-type relationships
 * @returns {Promise<Database["Tables"][T]["Row"][]>} - Returns an array of rows from the table.
 */
export async function findAll<T extends keyof Database["Tables"]>(
  table: T,
  options?: string,
  fields?: IModelField[]
): Promise<Database["Tables"][T]["Row"][]> {
  // Perform the GET request to the PostgREST endpoint with the constructed URL
  const rows = await get<Database["Tables"][T]["Row"][]>(tableUrl(table, options));

  // If no fields are provided or no list-type fields exist, return the rows as is
  if (!fields) return rows;

  // Find all list-type fields
  const listFields = fields.filter(field => field.type === 'list' && field.list_type);

  // For each row, process list-type fields
  const processedRows = await Promise.all(rows.map(async (row) => {
    const processedRow = { ...row };

    // Process each list-type field
    for (const field of listFields) {
      const fkValue = row[field.name as keyof typeof row];
      if (fkValue && field.list_type) {
        try {
          // Fetch the referenced record
          const referencedRecord = await get<Database["Tables"][typeof field.list_type]["Row"][]>(
            tableUrl(field.list_type, `id=eq.${fkValue}`)
          );

          if (referencedRecord.length > 0) {
            // Find the title field in the referenced record
            const titleField = field.list_fields?.find(f => f.list_title)?.name || 'name';
            // Replace the foreign key with the title value
            processedRow[field.name as keyof typeof row] = referencedRecord[0][titleField as keyof typeof referencedRecord[0]];
          }
        } catch (error) {
          console.error(`Error fetching referenced record for ${field.name}:`, error);
        }
      }
    }

    return processedRow;
  }));

  return processedRows;
}
