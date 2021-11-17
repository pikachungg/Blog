import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import { ThemeProvider } from '@emotion/react'
import { DchungTheme } from '../assets/DchungTheme'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container, Stack, TextField, TextareaAutosize, Button, Alert, Snackbar, Typography } from '@mui/material'

export default function Add() {

    const [date, setDate] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [body, setBody] = useState([{text: ""}])
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [open, setOpen] = useState(false); // Success
    const [emptyError, setEmptyError] = useState(false) //Empty fields
    const [wrongCredentialsError, setWrongCredentialsError] = useState(false) //wrong credentials
    const [deleteError, setDeleteError] = useState(false) //delete too many paragraphs

    useEffect(()=>{
        formatDate()
    }, [])

    const position = {
        vertical: "top",
        horizontal: "center"
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setEmptyError(false);
        setDeleteError(false);
        setWrongCredentialsError(false)
    };

    const resetErrors = () => {
        setOpen(false);
        setEmptyError(false);
        setDeleteError(false);
        setWrongCredentialsError(false)
    }

    const handleErrors = () => {
        if (title === "" || body === "" || description === "" || username === "" || password === ""){
            setEmptyError(true)
            return false
        }
        else{
            return true
        }
    }

    const handleChange = (index, e) => {
        let bodyValues = body;
        bodyValues[index].text = e.target.value
        setBody(bodyValues);
    }

    const addParagraphs = () => {
        setBody([...body, {text: ""}])
    }
    
    const removeParagraph = () => {
        let bodyValues = [...body];
        if (bodyValues.length > 1){
            bodyValues.splice(bodyValues.length - 1, 1);
            setBody(bodyValues);
        }
        else {
            setDeleteError(true)
        }
    }

    const handlePost = (e) => {
        e.preventDefault()
        resetErrors()
        if (handleErrors()){
            fetch('http://localhost:4000/createpost', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password, 
                    title,
                    description,
                    date,
                    body
                })
            })
            .then((res) => {
                if (res.status === 201){
                    setOpen(true)
                }
                if (res.status === 401){
                    setWrongCredentialsError(true)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    const formatDate = () => {
        let months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        setDate(`${months[mm - 1]} ${dd}, ${yyyy}`)
    }

    return (
        <ThemeProvider theme={DchungTheme}>
            <Container maxWidth="lg" sx={{marginBottom: "5%"}}>
                <Header/>
                <Container maxWidth="md">
                    <Stack spacing={2}>
                        <TextField id="standard-basic" label="Title" variant="standard" onChange={(e) => setTitle(e.target.value)}/>
                        <Typography>Date: {date}</Typography>
                        <TextField id="standard-basic" label="Description" variant="standard" onChange={e => setDescription(e.target.value)}/>
                        {
                            body.map((element, index) => (
                                <TextareaAutosize
                                    key={index}
                                    aria-label="minimum height"
                                    minRows={10}
                                    placeholder="Paragraph"
                                    style={{ width: '100%' }}
                                    onChange={e => handleChange(index, e)}
                                />
                            ))
                        }
                        
                        <Stack direction="row" justifyContent="center">
                            <Button onClick={()=> addParagraphs()} color="success"><AddIcon/></Button>
                            <Button onClick={() => removeParagraph()} color="error"><DeleteIcon/></Button>
                        </Stack>
                        <Stack direction='row' spacing={10} justifyContent="space-between">
                            <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(e) => setUsername(e.target.value)}/>
                            <TextField label="Password" type="password" onChange={(e) => setPassword(e.target.value)}/>
                            <Button variant="outlined" onClick={handlePost} sx={{width: '30%'}}>Post</Button>
                        </Stack>
                    </Stack>
                </Container>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={position}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Post was created!
                    </Alert>
                </Snackbar>
                <Snackbar open={emptyError} autoHideDuration={6000} onClose={handleClose} anchorOrigin={position}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Looks like there was an error try again!
                    </Alert>
                </Snackbar>
                <Snackbar open={wrongCredentialsError} autoHideDuration={6000} onClose={handleClose} anchorOrigin={position}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Wrong credentials!
                    </Alert>
                </Snackbar>
                <Snackbar open={deleteError} autoHideDuration={6000} onClose={handleClose} anchorOrigin={position}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Can't delete all paragraphs!
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    )
}
