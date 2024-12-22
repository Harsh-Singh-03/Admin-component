import { LoginForm } from './_component/login-form'

const Page = () => {
  return (
    <div className='grid place-items-center min-h-svh'>
        <div className='border rounded-lg p-4 lg:p-6 w-full max-w-[450px]'>
            <LoginForm />
        </div>
    </div>
  )
}

export default Page