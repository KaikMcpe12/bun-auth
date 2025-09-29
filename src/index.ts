import { Elysia } from "elysia";
import { z } from 'zod'
import { openapi } from '@elysiajs/openapi'
import { betterAuthPLugin, OpenAPI } from "./http/plugins/better-auth";

const app = new Elysia()
  .use(openapi({
      documentation: {
          components: await OpenAPI.components,
          paths: await OpenAPI.getPaths()
      }
  }))
  .use(betterAuthPLugin)
  .get("/", () => "Hello Elysia")
  .get("/users/:id", ({ params, user }) => {
    const id = params.id

    const authenticatedUserName = user.name

    console.log({ authenticatedUserName })

    return { id, name: "Kaik" }
  }, {
    auth: true,
    detail: {
      summary: "Buscar usuário por ID",
      tags: ['users'],
    },
    params: z.object({
      id: z.string(),
    }),
    response: {
      200: z.object({
        id: z.string(),
        name: z.string(),
      })
    }
  })
  .listen(3333);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
