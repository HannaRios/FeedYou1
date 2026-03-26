import { useEffect,useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Notifications({openPost}){

const { user } = useAuth();
const navigate = useNavigate();

const [notifications,setNotifications] = useState([]);

useEffect(()=>{

const load = async()=>{

const res = await fetch(`${API_URL}/api/notificaciones/${user.email}`);
const data = await res.json();

setNotifications(data);

};

load();

},[]);

if(notifications.length===0){

return(
<div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 text-sm">
Todo al día por aquí.
</div>
)

}

return(

<div className="bg-white rounded-3xl border border-gray-100">

{notifications.map(n=>{

let texto="";

if(n.tipo==="seguir") texto="empezó a seguirte";
if(n.tipo==="me_gusta") texto="le dio like a tu publicación";
if(n.tipo==="comentario") texto="comentó tu publicación";
if(n.tipo==="favorito") texto="guardó tu publicación";
if(n.tipo==="compartir") texto="compartió tu publicación";

return(

<div
key={n.id_notificacion}
className="flex items-center gap-3 p-4 border-b hover:bg-gray-50 cursor-pointer"
>

<img
onClick={()=>navigate(`/usuario/${n.email_origen}`)}
src={`${API_URL}${n.foto_perfil}`}
className="w-10 h-10 rounded-full object-cover"
/>

<p
onClick={()=>{

if(n.tipo==="seguir"){
navigate(`/usuario/${n.email_origen}`);
}else{
openPost(n.id_publicacion);
}

}}
className="text-sm text-gray-700"
>

<span className="font-semibold">{n.username}</span> {texto}

</p>

</div>

)

})}

</div>

)

}