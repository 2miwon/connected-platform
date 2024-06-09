import {create} from "zustand";

export const useUserStore = create((set)=>({
    user : null,
    setUser: user=>{
        if(user){
            set(user);
        }else{
            set({user: null});
        }
    },
}));