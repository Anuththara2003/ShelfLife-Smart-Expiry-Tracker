import { Stack } from "expo-router"

const AuthLayout = () => {
    return (
        <Stack screenOptions={{headerShown: false, animation: "fade_from_bottom"}}>
            <Stack.Screen name="welcome" options={{title: "Welcome"}} />
            <Stack.Screen name="login" options={{title: "Login"}} />
            <Stack.Screen name="signup" options={{title: "Register"}} />
        </Stack>
    )
}

export default AuthLayout