# Utility Calculator

This web-based application calculator is a simple web app that helps calculating approximately value of your electricity usage in Actew AGL.
The goal of this app is to give an indication how much you would have saved with the solar system in a period of time. If you have a loan, and want to know if the solar system is worth it, this might be the tool for it.

I build this web application as a way to remember how to practice using new Angular features like Signal.

## TODO List
- Add a way to temporarily save the results locally on browser.
- Add a clock to determine if the current time is Peak, Shoulder or Off-peak.
- Add a graph to view the daily usage.
- Display Breakdown rate usage for each type.
- Make update to the daily breakdown when table cost inputs are updated.
- Allow Table cost to adjust Supply Charge Quantity

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
