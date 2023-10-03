# Sistema de Gestión de Empleados y Fichaje

Una aplicación web para la gestión de empleados y el registro de fichajes.

## Índice

1. [Introducción](#introducción)
2. [Características](#características)
3. [Requisitos](#requisitos)
4. [Instalación](#instalación)
5. [Uso](#uso)
6. [Configuración](#configuración)
7. [Contribución](#contribución)
8. [Licencia](#licencia)
9. [Contacto](#contacto)

## Introducción

El Sistema de Gestión de Empleados y Fichaje es una aplicación diseñada para ayudar a las empresas a gestionar la información de sus empleados y realizar un seguimiento preciso de los fichajes de entrada y salida de los empleados. Esta aplicación proporciona una solución eficiente para la gestión de recursos humanos y el control de la asistencia.

## Características

- Registro de entrada y salida de empleados.
- Gestión de detalles de empleados como nombre, correo electrónico, posición, etc.
- Historial de fichajes detallado con horarios.
- Administración de empleados, incluyendo la creación, edición y eliminación de perfiles.
- Autenticación segura para empleados y administradores.
- Personalización de la configuración para la empresa.

## Requisitos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes:

- Node.js: [Descargar e instalar Node.js](https://nodejs.org/)
- Base de datos (por ejemplo, MySQL, PostgreSQL, MongoDB, etc.).
## Instalación

1. Clona este repositorio en tu máquina local.

2. Navega hasta el directorio del proyecto.

3. Instala las dependencias.

4. Configura las variables de entorno en un archivo `.env`. Puedes encontrar un ejemplo en `.env.example`.

5. Inicia la aplicación.

## Uso

- Accede a la aplicación en tu navegador web preferido.
- Inicia sesión como empleado o administrador.
- Registra tu entrada y salida.
- Administra los detalles de los empleados.
- Explora el historial de fichajes.

## Configuración

Para personalizar la configuración de la aplicación, edita el archivo `.env` y establece las variables de entorno según tus necesidades.

## Endpoints de la API

### Usuarios y Autenticación

#### 1. Registrar Usuario

- **Método HTTP:** POST
- **Ruta:** `/api/register`
- **Descripción:** Permite a los usuarios registrarse en la plataforma proporcionando los detalles requeridos,  nombre de usuario, contraseña, nombre, correo electrónico y devuelve el id de usuario o nº de empleado.

#### 2. Iniciar Sesión

- **Método HTTP:** POST
- **Ruta:** `/api/login`
- **Descripción:** Permite a los usuarios iniciar sesión en la plataforma utilizando sus credenciales (id y contraseña).

#### 3. Cerrar Sesión

- **Método HTTP:** POST
- **Ruta:** `/api/logout`
- **Descripción:** Permite a los usuarios cerrar sesión y finalizar su sesión activa en la plataforma.

#### 4. Obtener Perfil de Usuario por ID

- **Método HTTP:** GET
- **Ruta:** `/profile/:userId`
- **Descripción:** Recupera el perfil de un usuario específico utilizando su ID. Se requiere autenticación.

#### 5. Obtener Perfil de Todos los Usuarios

- **Método HTTP:** GET
- **Ruta:** `/users/profile`
- **Descripción:** Recupera el perfil de todos los usuarios registrados en la plataforma.

#### 6. Actualizar Usuario

- **Método HTTP:** PUT
- **Ruta:** `/users/:userId`
- **Descripción:** Permite a los usuarios actualizar su información de perfil. Se requiere autenticación y la URL debe incluir el ID del usuario que se va a actualizar.

#### 7. Eliminar Usuario

- **Método HTTP:** DELETE
- **Ruta:** `/users/:userId`
- **Descripción:** Permite a los usuarios eliminar su cuenta de usuario. Se requiere autenticación y la URL debe incluir el ID del usuario que se va a eliminar.

### API de Fichaje

#### 8. Registrar Entrada (Check-In)

- **Método HTTP:** POST
- **Ruta:** `/api/checkin`
- **Descripción:** Permite a los empleados registrar su entrada. Incluye la hora de entrada y otros detalles relevantes.

#### 9. Registrar Salida (Check-Out)

- **Método HTTP:** POST
- **Ruta:** `/api/checkout`
- **Descripción:** Permite a los empleados registrar su salida. Incluye la hora de salida y otros detalles relevantes.

#### 10. Obtener Historial de Fichajes

- **Método HTTP:** GET
- **Ruta:** `https://localhost/api/fichajes`
- **Descripción:** Recupera el historial de fichajes de un empleado en particular o de todos los empleados. 

#### 11. Obtener Estado Actual del Empleado

- **Método HTTP:** GET
- **Ruta:** `/api/estado`
- **Descripción:** Recupera el estado actual de un empleado, es decir, si está dentro o fuera de la empresa.
