const headers = new Headers();
headers.append('authorization', 'Bearer OldToken');
headers.set('Authorization', 'Bearer NewToken');
console.log(Array.from(headers.entries()));
