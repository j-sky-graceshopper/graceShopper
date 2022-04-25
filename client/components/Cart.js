import React from "react";
import { connect } from "react-redux";
import { fetchCart, changeStatus, updateCart } from "../store/cart";
import history from "../history";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.loadCart("Created");
  }

  async handleCheckout() {
    if (this.props.isLoggedIn) {
      await this.props.checkoutCart(this.props.cart.id, "Processing");
    }
    history.push("./checkout");
  }

  handleChange(event, item) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    item.quantity = parseInt(event.target.value)
    // cart.push(item.product);
    //if statements to keep track

    localStorage.setItem("cart", JSON.stringify(cart));

    this.props.updateCart(item);
  }

  render() {
    let items;

    if (this.props.isLoggedIn) {
      items = this.props.cart.items || [];
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const itemAmount = {};

      for (let i = 0; i < cart.length; i++) {
        if (itemAmount[cart[i].title]) {
          itemAmount[cart[i].title]++;
        } else {
          itemAmount[cart[i].title] = 1;
        }
      }

      const key = "title";
      const uniqueItems = [
        ...new Map(cart.map((item) => [item[key], item])).values(),
      ];

      items = uniqueItems.map((item) => ({
        product: item,
        quantity: itemAmount[item.title],
      }));
    }

    let total = 0;
    items.forEach((item) => {
      total += item.product.price * item.quantity;
    });

    return (
      <div id="cart-container">
        {items.length > 0 ? (
          <>
            <h1 id="cart-title">Your Shopping Cart</h1>
            <div className="total">
              <h3>Total: ${total}</h3>
              <button onClick={this.handleCheckout}>Checkout</button>
            </div>
          </>
        ) : (
          <h1 id="cart-title">No Items In Your Cart</h1>
        )}
        <div className="cart-display">
          {items.map((item) => (
            <div className="cart-item" key={item.product.id}>
              <img src={item.product.imageUrl} />
              <h3>{item.product.title}</h3>
              <li>Price: ${item.product.price}</li>
              <li>
                <form>
                  <label id="quantity-input" htmlFor="quantity">
                    Quantity:
                    <input
                      type="number"
                      id="quantity"
                      min={0}
                      max={item.product.inventory}
                      value={item.quantity}
                      onChange={(event) => this.handleChange(event, item)}
                    />
                  </label>
                </form>
                Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
              </li>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadCart: (status) => dispatch(fetchCart(status)),
    checkoutCart: (cartId, status) => dispatch(changeStatus(cartId, status)),
    updateCart: (item) => dispatch(updateCart(item)),
  };
};
const mapState = (state) => {
  return {
    cart: state.cart,
    isLoggedIn: !!state.auth.id,
    auth: state.auth,
  };
};

export default connect(mapState, mapDispatch)(Cart);

