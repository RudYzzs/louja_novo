const products = [
  {
    id: 1,
    name: "Estátua Cthulhu Deluxe Art",
    price: 499.90,
    category: "colecionaveis",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Teclado Mecânico RGB Cyberpunk",
    price: 350.00,
    category: "eletronicos",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Headset Gamer Surround 7.1",
    price: 289.90,
    category: "eletronicos",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Action Figure Cyber Ninja",
    price: 199.90,
    category: "colecionaveis",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80"
  }
];

function addProductToCatalog(productData) {
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: productData.name,
    price: parseFloat(productData.price),
    category: productData.category,
    image: productData.image || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80"
  };
  products.push(newProduct);
  return newProduct;
}