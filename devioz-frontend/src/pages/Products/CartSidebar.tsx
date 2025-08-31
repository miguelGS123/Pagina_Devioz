import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface CartSidebarProps {
  cartItems: Product[];
  onClose: () => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  cartItems,
  onClose,
  increaseQuantity,
  decreaseQuantity,
}) => {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Carrito</h2>
        <button onClick={onClose} className="text-gray-700 text-xl">✕</button>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-700">El carrito está vacío.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <h3 className="text-gray-900 font-semibold">{item.name}</h3>
                <p className="text-gray-700">${item.price}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-2 py-1 bg-gray-800 text-white rounded">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 font-bold text-gray-900">
            Total: ${total}
          </div>

          <button
            onClick={() => alert("Redirigir a la compra o procesar pago")}
            className="mt-4 w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors font-semibold"
          >
            Comprar
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
