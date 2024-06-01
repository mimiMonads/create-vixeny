<head>
    <link rel="stylesheet" href="/css/prism.css">
    <link rel="stylesheet" href="/css/main.css">
    <script src="/mjs/docs.mjs" type="module"></script>
</head>

<header>
  <nav>
      <a href="/">Home</a>
      <a href="/docs">Docs</a>
      <a href="/api/panel">Panel</a>
      <a href="/login">Login</a>
  </nav>
</header>

<main>

1. [Introduction to `create-vixeny`](#introduction-to-create-vixeny)
   - [Petitions](#petitions)
   - [Wrap](#wrap)
     - [Debugging](#debugging)
     - [Testing](#testing)
     - [Mocking](#mocking)
     - [Join](#join)
2. [Resolution](#resolution)
   - [Morphism](#morphism)
3. [Resolve Properties](#resolve-properties)
   - [Resolution](#resolution-1)
   - [SyncAgnostic](#syncagnostic)
   - [Composable and Reusable](#composable-and-reusable)
4. [Optimizer](#optimizer)




# Introduction to `create-vixeny`

Welcome to the `create-vixeny` documentation. Our aim is to provide you with practical guidance on using Vixeny, focusing more on its application than on the underlying mechanics. In this introductory section, we'll clarify some fundamental concepts essential for working with Vixeny.

## Petitions

In Vixeny, routes are referred to as "petitions." These are objects that in almost all cases necessitate a function, denoted as `f`, and a `path`. The example below illustrates how to define a basic petition:

```javascript
  const helloWorld = petitions.common()({
    path: "/hello",
    f: () => "helloWorld",
  })
```

## Wrap

The `wrap` is a pure function designed to facilitate the handling and manipulation of petitions. It allows you to configure options, and incorporate a suite of tools for debugging, testing, and more.


```javascript
const options = {...}; // Optional configuration

  export const root = wrap(options)()
  .stdPetition({
    path: "/ping",
    f: () => "pong"
  })
  .addAnyPetition(helloWorld)
  ;
```

### Debugging

With `wrap`, you can easily inspect the current state at any point between methods:

```javascript
const server = wrap()()
  .stdPetition({
    path: '/one',
    f: () => 'one'
  })
  // Logging the paths after adding the first petition:
  .logPaths()
  .stdPetition({
    path: '/two',
    f: () => 'two'
  })
  // Logging the paths after adding the second petition:
  .logPaths()
  .union(root.unwrap())
  .logPaths()
  // Logging the paths including `/hello`
```

### Testing

Vixeny can be tested without the need for a server, allowing for individual or comprehensive testing of wraps:

```javascript
// Re-using the last wrap
const server = wrap(...)...

const testServer = server.testRequests();

// Simulate requests and test responses
testServer(new Request("/helloWold")).then(response => {
  // Perform assertions or checks on the response
});
```

### Mocking

Vixeny supports testing individual petitions by injecting values while preserving their structure:

```javascript
const request = new Request("http://localhost/one");
const paths = wrap()()
  .stdPetition({
    path: '/one',
    f: c => c.date.toString()
  });

// Handling the request without modifications
const handles = paths.handleRequest("/one")({});

// Handling the request with a mock date injected
const mocked = paths.handleRequest("/one")({
  options: {
    setDate: 1710592645075
  }
});

// Outputs the current date
console.log(await handles(request).then(r => r.text()));

// Outputs the mocked date: "1710592645075"
console.log(await mocked(request).then(r => r.text()));
```

### Join

You can combine petitions from another `wrap` instance with the current one, allowing for the reuse of petitions across different parts of your application:

```javascript
// Assuming `server` 
export default wrap()()
  .union(server.unwrap())
  .stdPetition({
    path: "/hello",
    f: () => "helloWorld",
  })
  .logPaths(); // Outputs paths from both the current wrap and the imported `extension`.
```

Vixeny is fully typed, with JSDoc examples provided for ease of use. Hover over the code in your IDE to check.

# Resolution

Unlike traditional frameworks that rely on life cycles for code execution and rendering management, Vixeny employs a concept called "resolution." A resolution is defined as: 

> The chaining of the resolution of any morphism by its `resolve`.

## Morphism

The most fundamental type in Vixeny is a "morphism." All petitions using the `composer`, `resolve`, or `branch` are considered morphisms. Vixeny provides a function to help type these objects:

```javascript
//resolve
const hello = petitions.resolve()(
  {
    resolve: {
	// nested resolve
      nested: {
        f: () => "hello",
      },
    },
    f: (f) => f.resolve.nested,
  },
);
```

> Any `resolve` or `branch` can be utilized within a `morphism`, but there are not considered `petitions`, meaning, you can not use them directly in a `wrap`.

## Resolve Properties

Vixeny's resolution mechanism ensures that data dependencies are resolved before the main function is executed. This feature enhances the framework's efficiency and developer experience by simplifying asynchronous data handling. Below, we explore key properties of resolution in Vixeny.

### Resolves

The resolution process guarantees that all necessary data is fetched and available for use within your petitions.


```javascript
wrap(options)()
  .stdPetition({
    path: "/withResolve",
    resolve: {
      hi: { f: () => "Hello world" },
    },
    f: (ctx) => ctx.resolve.hi,
  });
```

### SyncAgnostic

Vixeny's design ensures that the signature of your functor (function), `f`, remains unaffected by whether its dependencies, declared in `resolve`, are synchronous or asynchronous. This allows for greater flexibility and simplicity in defining your application's logic:

```javascript
wrap(options)()
  .stdPetition({
    path: "/helloWorld",
    resolve: {
      hello: { f: async () => await Promise.resolve("Hello") },
      world: { f: () => 'world' }
    },
    // Important to notice that `f` is synchronous even if the resolve `hello` is not.
    f: ctx => `${ctx.resolve.hello} ${ctx.resolve.world}`,
  });
```

### Mockable

This design also simplifies the process of mocking dependencies for testing purposes, as shown below:

```javascript
// Define the original asynchronous resolve function for fetching weather data
const routes = wrap(options)()
  .stdPetition({
    path: "/weather",
    resolve: {
      currentWeather: {
         f: async () => await fetch("https://api.weather.com/current").then(res => res.json())
      }
    },
    f: (c) => c.resolve.currentWeather.temperature > 75 ? "It's warm outside" : "It's cool outside"
  });

// Mock the resolve function for testing
const mockedWeatherResolve = () => ({ temperature: 80 });

// Inject the mocked resolve
const mockRoutes = routes.handleRequest("/weather")({
  resolve: {
    currentWeather: mockedWeatherResolve
  }
});

// Test the behavior with mocked data
test("/weather", async () => {
  expect(
    await mockRoutes(new Request("/weather")).then(res => res.text())
  ).toStrictEqual("It's warm outside");
});
```

### Composable and Reusable

The resolution mechanism allows for the reuse and on-the-fly modification of any morphism, making your code more modular and maintainable:

```javascript
// Define a resolve
const hello =  petitions.resolve(options)({
  resolve: {
    nested: {
      f: () => "hello",
    },
  },
  f: (f) => f.resolve.nested,
});

const serve = wrap(options)()
  .stdPetition({
    path: "/one",
    resolve: {
      hello: hello,
    },
    f: (f) => f.resolve.hello,
  })
  .stdPetition({
    path: "/two",
    resolve: {
      otherName: hello,
    },
    f: (f) => f.resolve.otherName,
  });
```

> This feature underscores the importance of utilizing `morphism` to ensure type safety within your functions.

# Composer

The `composer` in Vixeny plays a crucial role by overseeing the `CTX` within functions, composing petitions, chaining `resolve` and `branch`, and efficiently handling both asynchronous and synchronous operations. But what exactly does this entail? Let's delve into the concept of `CTX` and its role in TypeScript, which exposes all native functions (including plugins, not covered here):

```typescript
export default wrap()()
  .stdPetition({
    path: "/",
    f: () => "helloWorld",
  })
  // Console logging: []
  .logLastCheck()
  .stdPetition({
    path: "/hello/:id",
    f: (c) => c.param.id,
  })
  // Console logging: ["param"]
  .logLastCheck();
```

The optimizer analyzes your petitions and selectively adds only the necessary elements to the `CTX`. This process ensures optimal performance and cleaner code by avoiding unnecessary inclusions. However, the optimizer's automated nature means it might not automatically include external function requirements. You can manually specify these as needed:

```typescript
export default wrap()()
  .stdPetition({
    path: "/hello/query1",
    f: (c) => functionOutsideOfContext(c),
  })
  // Console logging: []
  .logLastCheck()
  .stdPetition({
    path: "/hello/query2",
    f: (c) => functionOutsideOfContext(c),
    options: {
      add: ["query"],
    },
  })
  // Console logging: ["query"]
  .logLastCheck();
```

Customization options include `only`, which bypasses the optimizer to add only specified functions; `add`, which includes additional functions; and `remove`, which excludes


</main>