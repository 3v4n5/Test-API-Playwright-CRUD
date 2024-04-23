import { test, expect } from '@playwright/test';
import { request } from 'http';



test.describe.parallel('API Testing', ()=>{//parallel hace los test en paralelo
    
    const baseUrl = 'https://reqres.in/api'
    test('API test status code', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/3`)    
        expect(response.status()).toBe(200)     

        const responseBody = JSON.parse(await response.text())
        console.log(responseBody)
    })
    
    test('API No end Point', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/2/cualquier-cosa`)    
        expect(response.status()).toBe(404)     
    })
    
    test('GET user details', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/1`) 
        const responseBody = JSON.parse(await response.text())

        expect (response.status()).toBe(200)
        expect(responseBody.data.id).toBe(1)
        expect(responseBody.data.first_name).toContain('George')
        expect(responseBody.data.last_name).toContain('Bluth')
        expect(responseBody.data.email).toBeTruthy()

        console.log(responseBody)

    })
    
    test('POST request - Create a new user', async ({ request }) => {
        const response = await request.post(`${baseUrl}/users`,{
            data:{
                id: 1000,
                "name": "3v@n$",
                "job": "Enginner"
            },
        }) 
        const responseBody = JSON.parse(await response.text())    
        expect(responseBody.id).toBe(1000)
        expect(responseBody.createdAt).toBeTruthy()
        expect(responseBody.name).toBe('3v@n$')
        expect(responseBody).toMatchObject( {id:1000, job:'Enginner'} )
        console.log(responseBody)
    })
    
    test('POST request - Login ', async ({ request }) => {
        const response = await request.post(`${baseUrl}/login`,{
            data:{
                "email": "eve.holt@reqres.in",
                "password": "cityslicka"
            },
        }) 
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(200)
        expect(responseBody.token).toBeTruthy()
    })
    
    test('POST request - Login Fail ', async ({ request }) => {
        const response = await request.post(`${baseUrl}/login`,{
            data:{
                "email": "peter@klaven"
            },
        }) 
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(400)
        expect(responseBody.error).toBe('Missing password')
    })
    
    test('PUT request - Update ', async ({ request }) => {
        const response = await request.put(`${baseUrl}/users/2`,{
            data:{
                "name": "New name",
                "job": "New job"
            }
        }) 
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(200)
        expect(responseBody.name).toContain('New name')
        expect(responseBody.job).toContain('New job')
        expect(responseBody.updatedAt).toBeTruthy()
    })
    
    test('DELETE request - Delete user ', async ({ request }) => {
        const response = await request.delete(`${baseUrl}/users/2`) 
        expect(response.status()).toBe(204)
    })
})