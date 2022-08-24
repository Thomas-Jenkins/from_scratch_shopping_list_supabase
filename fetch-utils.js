const SUPABASE_URL = 'https://sushgnkqkgfdkwxudpdy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1c2hnbmtxa2dmZGt3eHVkcGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAwNjEyMDEsImV4cCI6MTk3NTYzNzIwMX0.PWaLx9CyI6jaOzBx-1JPnId6_IrMlC4rYSEFZtsLwPw';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export function checkAuth() {
    const user = getUser();
    // do we have a user?
    if (!user) {
        // path is different if we are at home page versus any other page
        const authUrl = location.pathname === '/' ? './auth/' : '../auth/';
        // include the current url as a "redirectUrl" search param so user can come
        // back to this page after they sign in...
        location.replace(`${authUrl}?redirectUrl=${encodeURIComponent(location)}`);
    }

    // return the user so can be used in the page if needed
    return user;
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */
export async function createListItem(item, quantity) {
    const response = await client.from('shopping_list')
        .insert({ 
            item: item, 
            quantity: quantity, 
            bought: false, 
            user_id: client.auth.user().id })
        .single();
    
    return response;
}
export async function readList() {
    const response = await client.from('shopping_list').select('*');
    return response.data;
}
export async function boughtItem(id) {
    const response = await client.from('shopping_list').update({ bought: true }).match({ id });
    return response;
}
export async function deleteList() {
    const response = await client.from('shopping_list').delete().match({ user_id: client.auth.user().id });
    return response;
}
