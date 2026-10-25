import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductPage from "../pages/ProductPage";
import Cart from "../pages/Cart";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";
import ShippingAddress from "../pages/ShippingAddress";
import PaymentMethod from "../pages/PaymentMethod";
import PlaceOrder from "../pages/PlaceOrder";
import OrderDetails from "../pages/OrderDetails";
import OrderHistory from "../pages/OrderHistory";
import UserProfile from "../pages/UserProfile";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import SearchResults from "../pages/SearchResults";
import AllProducts from "../pages/Admin/AllProducts";
import OrderList from "../pages/Admin/OrderList";
import CategoryBasedPage from "../pages/CategoryBasedPage";

const App = () => {
  return (
    <Router>
      <div className="app-shell">
        <Header />
        <main className="app-main-content">
          <Switch>
            <Route path="/" component={Home} exact />
            <Route exact path="/cart/:id?" component={Cart} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/register" component={Register} />
            <Route path="/products/product/:id" component={ProductPage} />
            <Route path="/shipping" component={ShippingAddress} />
            <Route path="/payment" component={PaymentMethod} />
            <Route path="/placeorder" component={PlaceOrder} />
            <Route path="/order/:id" component={OrderDetails} />
            <Route path="/orderhistory" component={OrderHistory} />
            <PrivateRoute path="/profile" component={UserProfile} />
            <Route path="/searchresults/:query" component={SearchResults} exact />
            <Route path="/category/:cat" component={CategoryBasedPage} exact />

            {/* Admin section routes */}
            <AdminRoute path="/productlist" component={AllProducts} />
            <AdminRoute path="/orderlist" component={OrderList} />
            <AdminRoute path="/admin/orders" component={OrderList} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
