# Burger Queen - API con Node.js

Burger Queen es una aplicación para un restaurante que permite gestionar pedidos desde una tablet y administrar los usuarios y productos del sistema.

## Índice

* [1. Introducción](#1-introduccion)
* [2. Resumen del proyecto](#2-resumen-del-proyecto)
* [3. Tecnologías Utilizadas](#3-tecnologias-utilizadas)
* [4. Roles y funcionalidades](#5-roles-funcionalidades)
* [5. Consideraciones generales](#4-consideraciones-generales)
* [6. Criterios de aceptación mínimos del proyecto](#5-criterios-de-aceptaci%C3%B3n-m%C3%ADnimos-del-proyecto)



## 1. Introducción

![Node.js logo](https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg)

Burger Queen es un pequeño restaurante de hamburguesas en crecimiento. Para mejorar la eficiencia en la toma de pedidos y la preparación de alimentos, necesita un sistema digital.

## 2. Resumen del proyecto

Este proyecto se centra en el desarrollo de una API para Burger Queen. Esta API permite la gestión de usuarios, productos y pedidos dentro del sistema, utilizando Node.js y Express. Se integra con una base de datos MongoDB y está diseñada para interactuar con una interfaz web desarrollada por otro equipo.

[Documentación completa de la API](https://app.swaggerhub.com/apis-docs/ssinuco/BurgerQueenAPI/2.0.0)

## 3. Tecnologías Utilizadas

- **Node.js:** Entorno de ejecución para JavaScript.
- **Express:** Framework para aplicaciones web en Node.js.
- **Mongoose:** Herramienta de modelado de objetos para MongoDB y Node.js.
- **MongoDB:** Base de datos NoSQL orientada a documentos.
- **Docker:** Plataforma para desarrollar, enviar y ejecutar aplicaciones en contenedores.

## 4. Roles y funcionalidades

**Admin:**

- Gestión completa de usuarios y productos.
- Agregar, actualizar y eliminar productos y usuarios.

**Waiter:**

- Visualizar productos.
- Crear pedidos que se envían a la cocina.

**Chef:**

- Visualizar pedidos.
- Actualizar el estado de los pedidos cuando están listos.

## 5. Consideraciones generales

Este proyecto se podrá integrar con el proyecto [Burger Queen API client](https://github.com/andreastefbustos/DEV009-burger-queen-api-client) que desarrolle. 

Se realizaron **pruebas _end-to-end_**, que se uso para verificar el comportamiento desde el punto de vista de HTTP, desde afuera del servidor. 

Para ejecutar los tests _end-to-end_ se utiliza el comando `npm run test:e2e`.

```sh
# Corre pruebas e2e sobre instancia local. Esto levanta la aplicación con npm
# start y corre los tests contra la URL de esta instancia (por defecto
# http://127.0.0.1:8080).
npm run test:e2e

# Corre pruebas e2e sobre URL remota
REMOTE_URL=<TODO: poner URL> npm run test:e2e
```

## 6. Criterios de aceptación mínimos del proyecto

### 6.1 API

Según lo establecido por la [documentación](https://app.swaggerhub.com/apis-docs/ssinuco/BurgerQueenAPI/2.0.0) entregada por nuestra clienta, la API debe exponer los siguientes endpoints:

#### 6.1.1 `/`

* `GET /`

#### 6.1.2 `/auth`

* `POST /auth`

#### 6.1.3 `/users`

* `GET /users`
* `GET /users/:uid`
* `POST /users`
* `PATCH /users/:uid`
* `DELETE /users/:uid`

#### 6.1.4 `/products`

* `GET /products`
* `GET /products/:productid`
* `POST /products`
* `PATCH /products/:productid`
* `DELETE /products/:productid`

#### 6.1.5 `/orders`

* `GET /orders`
* `GET /orders/:orderId`
* `POST /orders`
* `PATCH /orders/:orderId`
* `DELETE /orders/:orderId`

### 6.2 CLI

La clienta nos ha solicitado que la aplicación cuente un comando **`npm start`**
que se debe encargar de ejecutar nuestra aplicación node y que además pueda
recibir información de configuración, como el puerto en el que escuchar, a qué
base datos conectarse, etc. Estos datos de configuración serán distintos entre
diferentes entornos (desarrollo, producción, etc.). El _boilerplate_ ya
implementa [el código necesario](config.js) para leer esta información de los
[argumentos de invocación](https://nodejs.org/docs/latest/api/process.html#process_process_argv) y el [entorno](https://nodejs.org/docs/latest/api/process.html#process_process_env).

#### 6.2.1 Argumentos de línea de comando

Podemos especificar el puerto en el que debe arrancar la aplicación pasando un
argumento a la hora de invocar nuestro programa:

```sh
# Arranca la aplicación el puerto 8888 usando npm
npm start 8888
```

#### 6.2.2 Variables de entorno

Nuestra aplicación usa las siguientes variables de entorno:

* `PORT`: Si no se ha especificado un puerto como argumento de línea de comando,
  podemos usar la variable de entorno `PORT` para especificar el puerto. Valor
  por defecto `8080`.
* `DB_URL`: El _string_ de conexión de _MongoDB_. Cuando ejecutemos la
  aplicación en nuestra computadora (en entorno de desarrollo), podemos usar el
  una base de datos local `mongodb://localhost:27017/queen`.
* `JWT_SECRET`: Nuestra aplicación implementa autenticación usando JWT (JSON
  Web Tokens). Para poder firmar (cifrar) y verificar (descifrar) los tokens,
  nuestra aplicación necesita un secreto. En local puedes usar el valor por
  defecto (`104d7a31bd5babd695ba92c8cd18b57b8c275edfdc86a80359253185a05cb74d`).
  en producción.
* `ADMIN_EMAIL`: Opcionalmente podemos especificar un email y password para
  el usuario admin (root). Si estos detalles están presentes la aplicación se
  asegurará que exista el usuario y que tenga permisos de administrador. Valor
  por defecto `andrea@gmail.com`.
* `ADMIN_PASSWORD`: Si hemos especificado un `ADMIN_EMAIL`, debemos pasar
  también una contraseña para el usuario admin. Valor por defecto: `123456`.

### 6.3 Despliegue (Deployment)

El despliegue se hizo en Render, para ingresar a la API ingresa [aquí](https://queen-api-800w.onrender.com).

