
import "./styles/Badge.css"


export default function Badge({
    count, 
    background='red', 
    color='white',
    top= '-10px',
    right='-10px',
    left='unset'
}) {


    return (
        <div 
            style={{background:background, color, top, right, left}} 
            className="badge-main"
        >
            <span className="badge-count" style={{color}}>{count}</span>
        </div>
    )
}