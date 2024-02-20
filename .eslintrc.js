// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser', // Определяет парсер ESLint для TypeScript
    extends: [
        'plugin:@typescript-eslint/recommended', // Правила ESLint для TypeScript
        'prettier', // Отключает правила ESLint, которые могут конфликтовать с Prettier
        'plugin:prettier/recommended' // Добавляет Prettier в качестве правила ESLint
    ],
    parserOptions: {
        ecmaVersion: 2020, // Позволяет использовать последние возможности ECMAScript
        sourceType: 'module' // Позволяет использовать модули ES6
    },
    rules: {
        // Здесь можно добавить или переопределить правила ESLint
    }
};