import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { useString } from 'i18n/react'
import { GoogleIcon } from '../icons/google'
import { MicrosoftIcon } from '../icons/microsoft'
import Center from '../scaffolding/center'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

export function LoginScreen() {
    const welcome = useString('welcomeBack')
    const loginWithSocial = useString('loginWithSocialAccount')
    const loginWith = useString('loginWith')

    return (
        <Center>
            <Card className='w-full max-w-md'>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl font-bold text-center'>{welcome}</CardTitle>
                    <CardDescription className='text-center'>{loginWithSocial}</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col space-y-4'>
                    <a href='/api/auth/login/google'>
                        <Button onClick={() => undefined} className='w-full' variant='outline'>
                            <GoogleIcon />
                            {loginWith} Google
                        </Button>
                    </a>
                    <a href='/api/auth/login/github'>
                        <Button onClick={() => undefined} className='w-full' variant='outline'>
                            <GitHubLogoIcon className='w-5 h-5 mr-2' />
                            {loginWith} GitHub
                        </Button>
                    </a>
                    <a href='/api/auth/login/microsoft'>
                        <Button onClick={() => undefined} className='w-full' variant='outline'>
                            <MicrosoftIcon />
                            {loginWith} Microsoft
                        </Button>
                    </a>
                </CardContent>
            </Card>{' '}
        </Center>
    )
}
