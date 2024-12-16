import { serial, varchar, boolean, json, jsonb } from "drizzle-orm/pg-core"; // Use pg-core for PostgreSQL
import { pgTable } from "drizzle-orm/pg-core";

export const Users=pgTable('users',{
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    email:varchar('email').notNull(),
    imageUrl:varchar('imageUrl'),
    subscription:boolean('subscription').default(false)
})

export const VideoData = pgTable('videoData', {
    id: serial('id').primaryKey(),
    script: jsonb('script').array().notNull(),  // store script as an array of JSON objects
    audioFileUrl: varchar('audioFileUrl').notNull(),
    captions: json('captions').notNull(),
    imageList: varchar('imageList').array(),
    createdBy: varchar('createdBy').notNull()
});
