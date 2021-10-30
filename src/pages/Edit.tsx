import { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'; 
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import {  update, getCampaigns } from "../features/campaignSlice";
import {  useAppDispatch, useAppSelector} from "../app/hooks"
import { Spinner } from "../components/Spinner"
import Swal from "sweetalert2";


const Create: React.FC = () => {

    const history = useHistory();
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>()
    const [campaignName, setCampaignName] = useState(""); 
    const [from, setFrom] = useState(""); 
    const [to, setTo] = useState(""); 
    const [dailyBudget, setDailyBudget] = useState("");
    const [totalBudget, setTotalBudget] = useState("");
    const [loading, setLoading] = useState(true);
    const [responseError, setResponseError] = useState("");


    async function getCampaignRecord() {

      try{

        setLoading(true);
        const storeResponse = await axios.get(`/campaign/${id}`); 
        if(storeResponse.data.hasOwnProperty("campaign")){
          setCampaignName(storeResponse.data.campaign.name);
          setFrom(storeResponse.data.campaign.from);
          setTo(storeResponse.data.campaign.to);
          setDailyBudget(storeResponse.data.campaign.daily_budget);
          setTotalBudget(storeResponse.data.campaign.total_budget);
          
        }else if(storeResponse.data.hasOwnProperty("errors")){
          //console.log(storeResponse.data.errors);
          setResponseError(storeResponse.data.errors)
        }
       

      }catch(e){
          console.log(e)
      }finally{
        setLoading(false);
      }

    }


    useEffect( () => {
        document.title = "Edit Campaign"; 
    }, []);

    useEffect( () => {
     getCampaignRecord();
   
    }, []) 

 
     

    let initialValues = { name:  campaignName  , from: from, to: to, daily_budget: dailyBudget, total_budget: totalBudget, files: [],  id: id} 
    

  return (
    <>
  
      
   
    <div className="flex flex-col items-center px-4 md:px-5 mb-32 space-y-7 mx-2 mt-4 md:mx-36 lg:mx-96">
        <h2 className="text-blue text-2xl">Edit Campaign Record</h2>
        <Formik
        enableReinitialize={true} 
       initialValues={initialValues}
       validationSchema={Yup.object({
            name: Yup.string().required('Name is Required'),
            from: Yup.date().min(new Date(), "Must be a date in the Present or Future").label('From Date').required(),
            to: Yup.date().min(new Date(), "Must be a date in the Present or Future").label('To Date').required(),
            daily_budget: Yup.number().required('Daily Budget Required').positive().label('Daily Budget'),
            total_budget: Yup.number().required('Daily Budget Required').positive().label('Total Budget')
          })}
          onSubmit={ async (values, actions) => {
            let formData = new FormData();
            formData.append("name", values.name );
            formData.append("from", values.from); 
            formData.append("to", values.to); 
            formData.append("daily_budget", values.daily_budget); 
            formData.append("total_budget", values.total_budget); 
            formData.append("id", values.id); 
            formData.append("_method", "PUT");
            for(let i=0; i <= values.files.length; i++){
              formData.append(`files[${i}]`, values.files[i]);
            }

            try {
              const submitResponse = await dispatch(update(formData)).unwrap();
              console.log(submitResponse);
              if(submitResponse.hasOwnProperty('success') && submitResponse.success == true ){
                Swal.fire({
                  position: 'top-end',
                  title: 'Content Successfully Created',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 2000
                })
                setTimeout(() => {
                                    dispatch(getCampaigns());
                                    actions.resetForm();
                                    history.push("/");
                                  }, 500);
  
              }else{
                let errorResponses = [];
                for (const key in submitResponse.errors) {
                  errorResponses.push(submitResponse.errors[key]); 
                }
                const display_err = errorResponses.map((error, index) => (
                        <li className="p-1" key={index}>  {error}</li>
                ))
                actions.setStatus(<ol className="list-decimal p-4 bg-red-600 "> { display_err } </ol>);
              }
            } catch (err) {
                console.log(err);
            }
        
          }}
     >
       {({
         isSubmitting,
         isValid,
         status,
         setFieldValue 
       }) => (
        <Form className="form" >

          { (isSubmitting || loading) && <Spinner /> }
         { status &&  <div className="text-white "> { status } </div>   }
         { responseError &&  <div className="text-white p-4 bg-red-600 "> { responseError } </div>   }
    
         <div className="grid grid-cols-12 gap-5">
           

          <div className="col-span-12">
            <label className="block" htmlFor="name">
              Name
            </label>
              <Field type="text" name="name" className="form-input"/>
              <ErrorMessage name="name" component="div" className="text-red-900" />
              <Field type="hidden" name="id" className="form-input" />
          </div>

          <div className="col-span-12 md:col-span-6">
            <label className="block" htmlFor="from">
              From
            </label>
              <Field type="date" name="from" className="form-input"/>
              <ErrorMessage name="from" component="div" className="text-red-900" />
          </div>

          <div className="col-span-12 md:col-span-6">
            <label className="block" htmlFor="to">
              To
            </label>
              <Field type="date" name="to" className="form-input"/>
              <ErrorMessage name="to" component="div" className="text-red-900" />
          </div>

          <div className="col-span-12 md:col-span-6">
            <label className="block" htmlFor="daily_budget">
              Daily Budget
            </label>
              <Field type="number" name="daily_budget" className="form-input"/>
              <ErrorMessage name="daily_budget" component="div" className="text-red-900" />
          </div>

          <div className="col-span-12 md:col-span-6">
            <label className="block" htmlFor="daily_budget">
                Total Budget
            </label>
              <Field type="number" name="total_budget" className="form-input"/>
              <ErrorMessage name="total_budget" component="div" className="text-red-900" />
          </div>

          <div className="col-span-6">
            <label className="block" htmlFor="files">
              Campaign Files
            </label>
            <input type="file" name="files" accept="image/*"   className="form-input px-4 py-3" onChange={(e:any) => {setFieldValue("files", e.currentTarget.files );}} multiple />
              <ErrorMessage name="files" component="div" className="text-red-900" />
          </div>

          <div className="col-span-6">
          </div>

          <div className="col-span-6">
             <Link to="/"  >
                <button type="button"  className="cancel_btn  text-lg"  >
                  Cancel
                </button>
              </Link>
          </div>


          <div className="col-span-6">
            <button type="submit"  className={`${ ( isValid && !isSubmitting ) ? "btn" : "cancel_btn cursor-not-allowed" } text-lg disabled:opacity-0 float-right`} disabled={isSubmitting} >
              Save
            </button>
          </div>
        </div>
       </Form>
       )}
     </Formik>
        
      </div>
    
    
    </>
  );
};

export default Create;
