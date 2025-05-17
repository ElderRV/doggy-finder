
# DoggyFinder

Es una aplicación web que te permite encontrar a tu mejor amigo o publicar un perro perdido.


## Ejecutar localmente

Clona el proyecto

```bash
  git clone https://github.com/ElderRV/doggy-finder
```

Entra al directorio del proyecto

```bash
  cd doggy-finder
```

Instala las dependencias

```bash
  npm install
```

Añade las [variables de entorno](#variables-de-entorno)

Levanta el servidor

```bash
  npm run start
```


## Variables de entorno

Para ejecutar este proyecto, necesitarás añadir las siguientes variables de entorno al archivo `.env.local`

Copia el archivo .env.example

```bash
cp .env.example .env.local
```

Rellena las variables de entorno

```
# Firebase
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=

# Mapbox
VITE_MAPBOX_ACCESS_TOKEN=

# API
VITE_API_URL=http://localhost:8000
VITE_API_SEARCH_DOG_ENDPOINT=/search_dog
VITE_API_BREED_ENDPOINT=/breed
VITE_API_NSFW_ENDPOINT=/nsfw
```

# Dog classifier AI API (Backend)

[Dog classifier ai api](https://github.com/davidhernandezgalan/dog-classifier-ai-api)