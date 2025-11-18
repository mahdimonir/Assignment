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
  const uniqueValues: Primitive[] = [];

  const isValueAlreadyPresent = (
    array: readonly Primitive[],
    valueToCheck: Primitive
  ): boolean => {
    for (let index = 0; index < array.length; index++) {
      if (array[index] === valueToCheck) {
        return true;
      }
    }
    return false;
  };

  for (let index = 0; index < firstArray.length; index++) {
    const currentValue = firstArray[index];
    if (
      currentValue !== undefined &&
      !isValueAlreadyPresent(uniqueValues, currentValue)
    ) {
      uniqueValues[uniqueValues.length] = currentValue;
    }
  }

  for (let index = 0; index < secondArray.length; index++) {
    const currentValue = secondArray[index];
    if (
      currentValue !== undefined &&
      !isValueAlreadyPresent(uniqueValues, currentValue)
    ) {
      uniqueValues[uniqueValues.length] = currentValue;
    }
  }

  return uniqueValues;
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
