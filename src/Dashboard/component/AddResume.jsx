import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { v4 as uuidv4 } from 'uuid';

import { Loader2, PlusSquare } from "lucide-react";
import { useState } from "react";
import GlobalApi from "../../../service/GlobalApi";

import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function AddResume() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle , setResumeTitle] = useState();

  const [loading , setLoading] = useState();
  const {user} = useUser();

  const navigation = useNavigate();

  const onCreate = ()=>{
    setLoading(true)
    const uuid = uuidv4();

    const data ={
      data:{
        title:resumeTitle,
        resumeId:uuid,
        userEmail:user?.primaryEmailAddress?.emailAddress,
        userName:user?.fullName
      }
    }
    
    GlobalApi.CreateNewResume(data).then(resp=>{
      // console.log(resp?.data?.data?.uuid);
      if(resp)
        {
            setLoading(false);
            navigation('/dashboard/resume/'+resp?.data?.data?.documentId+"/edit");
            
        }
    } , ()=>{
      setLoading(false);
    });
  }
  return (
    <div>
      <div
        className="p-14 py-24 border items-center flex justify-center bg-inherit rounded-lg mt-10 h-[280px] hover:scale-105
        translate-all hover:shadow-lg cursor-pointer border-dashed"
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare />

      </div>

        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Resume </DialogTitle>
              <DialogDescription>
                <p>Add a title for your resume </p>
                <Input
                  className="my-2 "
                  placeholder="Ex. Full Stack Resume.."
                  onChange = {(e)=>setResumeTitle(e.target.value)}
                />
              </DialogDescription>
              <div className="flex justify-end gap-5">
                <Button onClick={()=>setOpenDialog(false)} variant="ghost">Cancel</Button>
                <Button 
                disabled={!resumeTitle||loading}
                onClick={()=>onCreate()}>
                  {
                    loading?<Loader2 className='animate-spin'/>:'Create'
                  }
                
                  
                  </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      
      
    </div>
  );
}

export default AddResume;
