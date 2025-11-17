# Blog Task

---

## 1. What are some differences between interfaces and types in TypeScript?

### Differences between Interfaces and Types

### Explanation

TypeScript-এ **interface** এবং **type**—দুটোই structure define করতে ব্যবহৃত হয়, কিন্তু এদের ক্ষমতা এবং behavior আলাদা।

**Interface** সাধারণত object অথবা class-এর shape define করার জন্য ব্যবহার হয়।  
**Type** আরও flexible—object-এর structure ছাড়াও **union, intersection, primitive, tuple** ইত্যাদি represent করতে পারে।

---

### 1. Usage Difference

#### Interface:

- Object এবং class-এর structure describe করতে ব্যবহৃত হয়।
- Methods সহ সম্পূর্ণ blueprint define করা যায়।

```ts
interface User {
  name: string;
  age: number;
  greet(): void;
}
```

#### Type:

- Object ছাড়াও primitive, function type, union, intersection—সবকিছু define করতে পারে।

```ts
type ID = string | number;
type Point = [number, number]; // tuple
type Callback = (() => void) | (() => string); // union
```

---

### 2. Extending / Inheritance

#### Interface uses `extends`:

```ts
interface A {
  x: number;
}

interface B extends A {
  y: number;
}
```

#### Type uses intersection (`&`):

```ts
type A = { x: number };
type B = A & { y: number };
```

---

### 3. Declaration Merging

**Interface supports merging**, অর্থাৎ একই নামের multiple interface declare করলে automatically merge হয়ে যায়।

```ts
interface Person {
  name: string;
}

interface Person {
  age: number;
}
// Person: { name: string; age: number }
```

**Type merging possible নয়**—একই নামে আবার declare করলে error দেয়।

```ts
type User = { name: string };
// type User = { age: number }; // TypeScript error
```

---

### 4. When to Use What?

- **Interface** → যখন object/class design করা হয় এবং future extension লাগতে পারে।
- **Type** → যখন union, intersection, function signatures, tuple, বা complex type logic দরকার।

---

## 2. What is the use of `enums` in TypeScript? Provide an example of a numeric and string enum.

### Use of `enums` in TypeScript

### Explanation

`enum` হলো TypeScript-এর একটি special feature, যা fixed constant values-এর একটি group তৈরি করতে সাহায্য করে।

যেমন:

- User roles
- Order status
- HTTP status codes
- App modes

Enum ব্যবহার করলে code readable হয়, typo কমে, এবং values centrally manage করা যায়।

---

## Numeric Enum

Numeric enum-এ values automatically increment হয়।

```ts
enum Status {
  Pending, // 0
  Approved, // 1
  Rejected, // 2
}

let current = Status.Approved;
console.log(current); // 1
```

### Manually assign:

```ts
enum HttpCode {
  OK = 200,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

console.log(HttpCode.OK); // 200
```

---

## String Enum

String enum-এ প্রতিটি value manually assign করতে হয়, যা readable এবং predictable।

```ts
enum Role {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST",
}

let r = Role.Admin;
console.log(r); // "ADMIN"
```

---

## Why use enum?

- Hard-coded string/number এড়িয়ে যায়।
- একই constant multiple জায়গায় safe ভাবে use করা যায়।
- Autocomplete এবং type safety পাওয়া যায়।
- Code clean এবং maintainable হয়।
