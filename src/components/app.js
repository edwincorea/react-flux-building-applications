import React from "react";
import Header from "./common/header";
import {RouteHandler} from "react-router";

var App = React.createClass({
    render: function() {
        return (
            <div>
                <Header/>
                <div className="container-fluid">
                    <RouteHandler/>
                </div>
            </div>
        );
    }
});

export default App;