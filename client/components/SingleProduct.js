import React, { Component } from "react";
import { connect } from "react-redux";
import { Add } from "tone";
import { singleProductThunk } from "../store/singleProduct";
import AddToCart from "./AddToCart";

class SingleProduct extends Component {
  componentDidMount() {
    this.props.loadSingleProdcut(this.props.match.params.productId);
  }

  render() {
    const product = this.props.product;
    const reviews = this.props.product.reviews || [];
    return (
      <div className="singleProduct">
        <h2>{product.title}</h2>
        <img src={product.imageUrl} />
        <h3>Price: ${product.price}</h3>
        <p>{product.description}</p>
        <AddToCart product={product} />
        <h3>Reviews:</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div className="productReviews" key={review.id}>
              <p>{review.content}</p>
            </div>
          ))
        )}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    product: state.product,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadSingleProdcut: (productId) => dispatch(singleProductThunk(productId)),
  };
};

export default connect(mapState, mapDispatch)(SingleProduct);
