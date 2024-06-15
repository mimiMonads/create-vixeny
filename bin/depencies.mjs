export const injectTemplates = {
  pug: (answers, dependencies) =>
    answers.installationChoice === "pug" ||
      answers.template?.find((x) => x === "pug")
      ? {
        ...dependencies,
        "pug": "^3.0.2",
      }
      : dependencies,
  react: (answers, dependencies) =>
    answers.installationChoice === "jsx" ||
      answers.installationChoice === "tsx" ||
      answers.template?.find((x) => x === "jsx" || x === "tsx")
      ? {
        ...dependencies,
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
      }
      : dependencies,

  ejs: (answers, dependencies) =>
    answers.installationChoice === "ejs" ||
      answers.template?.find((x) => x === "ejs")
      ? {
        ...dependencies,
        "ejs": "^3.1.9",
      }
      : dependencies,

  sass: (answers, dependencies) =>
    answers.style === "sass" ||
      answers.template?.find((x) => x === "sass")
      ? {
        ...dependencies,
        "sass": "^1.71.0",
      }
      : dependencies,

  postcss: (answers, dependencies) =>
    answers.style === "postcss" ||
      answers.template?.find((x) => x === "postcss")
      ? {
        ...dependencies,
        "autoprefixer": "^10.4.17",
        "postcss": "^8.4.35",
        "postcss-nested": "^6.0.1",
      }
      : dependencies,
};

export const injectPlugins = {
  typebox: (answers, dependencies) =>
    answers.plugins?.find((x) => x === "typebox")
      ? {
        ...dependencies,
        "@feathersjs/schema": "latest",
        "@sinclair/typebox": "latest",
      }
      : dependencies,
};

export const toReduceDep = (answers, dependencies, elements) =>
  Object.keys(elements).reduce(
    (acc, v) => elements[v](answers, acc),
    dependencies,
  );
