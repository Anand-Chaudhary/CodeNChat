import { useContext, useState, useEffect} from "react"
import {UserContext} from "../context/User.Context"
import {useNavigate} from "react-router-dom"


const UserAuth = ({children}) => {
    const {user} = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    
    
    useEffect(() => {
        if(user){
            setLoading(false)
        }
        if(!token) {
            navigate("/login")
        }
        if(!user) {
            navigate("/login")
        }
    }, [user, token, navigate])
    
    if(loading) {
        return <div>Loading....</div>
    }
  return (
  <>
    {children}
  </>
  )
}

export default UserAuth