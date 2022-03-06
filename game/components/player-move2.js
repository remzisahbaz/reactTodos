import React from "react";

export default function PlayerMove2(props){
    let move = props.value;

    let message =<span
            className="badge alert-success">{""+move.message}</span>


    return (
        <>
           {message}
        </>
    );
}