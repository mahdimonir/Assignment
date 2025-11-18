const formatValue = (
  input: string | number | boolean
): string | number | boolean | undefined => {
  if (typeof input === "string") {
    return input.toUpperCase();
  } else if (typeof input === "number") {
    return input * 10;
  } else if (typeof input === "boolean") {
    return !input;
  }
};

function getLength(input: string | unknown[]): number | undefined {
  if (typeof input === "string") {
    return input.length;
  }
  if (Array.isArray(input)) {
    return input.length;
  }
}

class Person {
  public name;
  public age;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  getDetails() {
    return `'Name: ${this.name}, Age: ${this.age}'`;
  }
}

type Item = {
  title: string;
  rating: number;
};
function filterByRating(items: readonly Item[]): Item[] {
  return items.filter((item) => item.rating >= 4);
}

type User = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
};
function filterActiveUsers(users: readonly User[]): User[] {
  return users.filter((user) => user.isActive);
}

interface Book {
  title: string;
  author: string;
  publishedYear: number;
  isAvailable: boolean;
}

function printBookDetails(book: Book): void {
  const availability = book.isAvailable ? "Yes" : "No";
  console.log(
    `Title: ${book.title}, Author: ${book.author}, Published: ${book.publishedYear}, Available: ${availability}`
  );
}

type Primitive = string | number;

function getUniqueValues(
  firstArray: readonly Primitive[],
  secondArray: readonly Primitive[]
): Primitive[] {
  const result: Primitive[] = [];
  const seen: Record<string, boolean> = {};

  const alreadySeen = (value: Primitive): boolean => {
    return seen[String(value)] === true;
  };

  const markAsSeen = (value: Primitive): void => {
    seen[String(value)] = true;
  };

  for (let i = 0; i < firstArray.length; i++) {
    const value = firstArray[i];
    if (value !== undefined && value !== null && !alreadySeen(value)) {
      markAsSeen(value);
      result[result.length] = value;
    }
  }

  for (let i = 0; i < secondArray.length; i++) {
    const value = secondArray[i];
    if (value !== undefined && value !== null && !alreadySeen(value)) {
      markAsSeen(value);
      result[result.length] = value;
    }
  }

  return result;
}

type Product = {
  name: string;
  price: number;
  quantity: number;
  discount?: number;
};
function calculateTotalPrice(products: readonly Product[]): number {
  if (products.length === 0) return 0;

  return products.reduce((total, product) => {
    const subtotal = product.price * product.quantity;
    const discountPercent = product.discount ?? 0;
    const discountedPrice = subtotal * (1 - discountPercent / 100);
    return total + discountedPrice;
  }, 0);
}
