import React from "react"

const Header = ({ title = "Infinity" }) => {
    return (
        <header className="header">
            <h1>{title}</h1>
        </header>
    )
}

export default Header