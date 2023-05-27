


export default function Input({onChange}) {



    return (
        <div className="input-container">
            
            <input type="text" onChange={onChange} className="auth-input"/>
        </div>
    );
}