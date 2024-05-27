import {FormControl, FormHelperText, InputLabel, Select} from "@mui/material";
import React, {useEffect, useState} from "react";
import MenuItem from "@mui/material/MenuItem";

export async function MuiSelect({  select,
                                    variant ,
                                    register,
                                    errors,
                                }){
    const getData=select.getData
    const selectData = select.data;
    const [options,setOptions]=useState(select.options)
    const [loading,setLoading]=useState(getData)
    const fullWidth=select.fullWidth
    const [value, setValue] = useState(select.value);

    const handleChange = (event) => {
        setValue(event.target.value);
    };
    useEffect(()=>{
        if(!options &&getData){
            async function fetchOptions(){
                setLoading(true)
                const fetchedOptions=await getData()
                setOptions(fetchedOptions)
                setLoading(false)
            }
            fetchOptions()
        }
    },[])


    return                (
          <FormControl  fullWidth={fullWidth}
          sx={select.sx}
          >
              <InputLabel id="demo-simple-select-label">{selectData.label}</InputLabel>
<Select
      {...register(selectData.id, select.pattern)}
      {...selectData}
      value={value}
      onChange={handleChange}
      error={errors?.[selectData.id]}
      variant={variant}
>
    {loading&&"جاري تحميل الخيارات"}
    {options?.map((option)=> (
          <MenuItem value={option.value} key={option.label}>
              {option.label}
          </MenuItem>
    ))}
</Select>
              <FormHelperText>{errors[selectData.id]?.message}</FormHelperText>

          </FormControl>
    )
    }