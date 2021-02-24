import React, { useState } from "react";
import {HashRouter as Router, Route,Switch} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home"

const AppRouter = ({isLoggedIn}) => {
    return(
        <Router>
            <Switch>
                {isLoggedIn ? (
                    <>
                <Router exact path ="/">
                    <Home />
                </Router> 
                </>     //Fragment 묶고싶을때 사용 div 등을 사용하고 싶지 않고 그냥 묶고만 싶을때
                ):( 
                 <>
                <Router exact path ="/">
                    <Auth />
                </Router>
                </>
                )}
            </Switch>
        </Router>
    );
}
export default AppRouter;