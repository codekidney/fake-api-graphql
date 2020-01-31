fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ post(id: 10) { id title user { email } } }' }),
})
.then(res => res.json())
.then(res => console.log(res.data));