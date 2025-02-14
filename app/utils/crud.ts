import database, { type Database } from "~/postgrest/database";
import { type IModelField } from "~/models";
import { getUserId } from "session.server";
import { hashPassword } from "./auth";

export async function handleCRUD(request: Request, fields: IModelField[], table: keyof Database["Tables"]) {
    const result: any = {};
    const user = await getUserId(request);
    if (!user && table !== 'user') throw new Error("Unauthorized User");
    const added_by = user;
    const body = await request.formData();

    fields.forEach((field) => {
        if (field.name === "id" && request.method === "POST") return;
        const value = body.get(field.name);
        result[field.name] = value !== null ? value : null;
    });

    if(table === 'user') {
        result["password"] = await hashPassword(result["password"]);

        switch (request.method) {
            case "POST":
                return await database.create(table, result);
            case "DELETE":
                return await database.delete(table, { username: result.username });
            case "PATCH":
                return await database.update(table, { username: result["username"] }, result);
        }
    } else {
        result["added_by"] = added_by;

        switch (request.method) {
            case "POST":
                return await database.create(table, result);
            case "DELETE":
                return await database.delete(table, { id: result.id });
            case "PATCH":
                return await database.update(table, { id: result["id"] }, result);
        }
    }

    

}