import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { useString } from 'i18n/react'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { GoogleIcon } from '../icons/google'
import { MicrosoftIcon } from '../icons/microsoft'
import { Button } from '../ui/button'

const loginStyles = `
    .lt-display { font-family: 'Fraunces', ui-serif, Georgia, 'Times New Roman', serif; font-optical-sizing: auto; }
    @keyframes lt-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes lt-float { 0%, 100% { transform: rotate(6deg) translateY(0); } 50% { transform: rotate(6deg) translateY(-14px); } }
    @keyframes lt-glow { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.95; } }
    .lt-rise { opacity: 0; animation: lt-rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
    .lt-float { animation: lt-float 9s ease-in-out infinite; }
    .lt-glow { animation: lt-glow 7s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
        .lt-rise { animation: none; opacity: 1; }
        .lt-float, .lt-glow { animation: none; }
    }
`

const AMBER = '#e9b872'

function ProviderButton({ href, icon, children, delay }: { href: string; icon: ReactNode; children: ReactNode; delay: number }) {
    return (
        <Button
            asChild
            variant='outline'
            size='lg'
            className='lt-rise group relative h-12 w-full justify-start rounded-xl border-border/80 bg-background px-4 text-[0.95rem] font-medium shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-accent hover:shadow-md'
            style={{ animationDelay: `${delay}ms` }}
        >
            <a href={href}>
                <span className='flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:!m-0'>{icon}</span>
                <span className='ml-1'>{children}</span>
                <ArrowRight className='absolute right-4 h-4 w-4 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100' />
            </a>
        </Button>
    )
}

export function LoginScreen() {
    const welcome = useString('welcomeBack')
    const loginWithSocial = useString('loginWithSocialAccount')
    const loginWith = useString('loginWith')
    const tagline = useString('loginTagline')
    const taglineSub = useString('loginTaglineSub')
    const terms = useString('loginTerms')

    return (
        <div className='relative grid h-full w-full overflow-hidden bg-background lg:grid-cols-[1.05fr_1fr]'>
            <style>{loginStyles}</style>

            {/* Brand showcase — always dark, constant across themes */}
            <aside className='relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-12 text-zinc-100 lg:flex xl:p-16'>
                {/* dot grid */}
                <div
                    className='pointer-events-none absolute inset-0'
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                        maskImage: 'radial-gradient(120% 90% at 30% 20%, #000 30%, transparent 80%)',
                        WebkitMaskImage: 'radial-gradient(120% 90% at 30% 20%, #000 30%, transparent 80%)',
                    }}
                />
                {/* warm glow */}
                <div
                    className='lt-glow pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full blur-3xl'
                    style={{ background: `radial-gradient(circle, ${AMBER}33, transparent 70%)` }}
                />

                {/* floating ticket card — mirrors the real ticket model (bare numeric code, status, priority, assignee) */}
                <div className='lt-float pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 xl:block'>
                    <div className='relative flex w-[20rem] rounded-2xl border border-white/10 bg-zinc-900/70 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md'>
                        {/* top sheen */}
                        <div className='pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] via-transparent to-transparent' />

                        {/* perforated stub */}
                        <div className='relative flex w-11 items-center justify-center rounded-l-2xl border-r border-dashed border-white/15 bg-white/[0.02]'>
                            <span className='rotate-180 font-mono text-[0.55rem] font-medium tracking-[0.35em] text-zinc-500 [writing-mode:vertical-rl]'>
                                LITTLE&nbsp;TICKETS
                            </span>
                        </div>
                        {/* punched notches on the perforation line */}
                        <span className='absolute -top-1.5 left-11 h-3 w-3 -translate-x-1/2 rounded-full bg-zinc-950' />
                        <span className='absolute -bottom-1.5 left-11 h-3 w-3 -translate-x-1/2 rounded-full bg-zinc-950' />

                        {/* body */}
                        <div className='relative flex-1 space-y-3 p-4'>
                            <div className='flex items-center justify-between'>
                                <span className='font-mono text-xs text-zinc-500'>#128</span>
                                <span className='flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 text-[0.65rem] font-medium text-zinc-300'>
                                    <span className='h-1.5 w-1.5 rounded-full' style={{ background: AMBER }} />
                                    In progress
                                </span>
                            </div>

                            <p className='text-[0.95rem] font-medium leading-snug text-zinc-50'>Polish the sign-in experience</p>

                            <div className='flex items-center justify-between pt-1.5'>
                                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 text-[0.6rem] font-semibold text-zinc-100 ring-1 ring-white/10'>
                                    TC
                                </span>
                                <span className='flex items-center gap-1.5 text-[0.65rem] font-medium text-zinc-400'>
                                    <span className='flex items-end gap-[2px]'>
                                        <span className='h-1.5 w-[3px] rounded-sm bg-zinc-600' />
                                        <span className='h-2 w-[3px] rounded-sm bg-zinc-400' />
                                        <span className='h-2.5 w-[3px] rounded-sm' style={{ background: AMBER }} />
                                    </span>
                                    High
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* wordmark */}
                <div className='lt-rise relative z-10 flex items-center gap-2.5'>
                    <span className='flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/10'>
                        <img src='/logo.svg' alt='' className='h-full w-full' />
                    </span>
                    <span className='lt-display text-xl font-medium tracking-tight'>Little Tickets</span>
                </div>

                {/* headline */}
                <div className='relative z-10 max-w-md'>
                    <div className='lt-rise mb-6 h-px w-12' style={{ background: AMBER, animationDelay: '120ms' }} />
                    <h1
                        className='lt-display text-balance text-4xl font-light leading-[1.1] tracking-tight xl:text-[2.75rem]'
                        style={{ animationDelay: '120ms' }}
                    >
                        {tagline}
                    </h1>
                    <p className='lt-rise mt-5 text-pretty text-sm leading-relaxed text-zinc-400' style={{ animationDelay: '220ms' }}>
                        {taglineSub}
                    </p>
                </div>
            </aside>

            {/* Auth column */}
            <main className='relative flex items-center justify-center px-6 py-12 sm:px-10'>
                {/* subtle glow behind the form on small screens */}
                <div
                    className='lt-glow pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl lg:hidden'
                    style={{ background: `radial-gradient(circle, ${AMBER}1f, transparent 70%)` }}
                />

                <div className='relative z-10 w-full max-w-sm'>
                    {/* mobile wordmark */}
                    <div className='lt-rise mb-10 flex items-center justify-center gap-2.5 lg:hidden'>
                        <span className='flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl ring-1 ring-border'>
                            <img src='/logo.svg' alt='' className='h-full w-full' />
                        </span>
                        <span className='lt-display text-xl font-medium tracking-tight'>Little Tickets</span>
                    </div>

                    <h2 className='lt-rise lt-display text-3xl font-medium tracking-tight'>{welcome}</h2>
                    <p className='lt-rise mt-2 text-sm text-muted-foreground' style={{ animationDelay: '120ms' }}>
                        {loginWithSocial}
                    </p>

                    <div className='mt-8 flex flex-col gap-3'>
                        <ProviderButton href='/api/auth/login/google' icon={<GoogleIcon />} delay={180}>
                            {loginWith} Google
                        </ProviderButton>
                        <ProviderButton href='/api/auth/login/github' icon={<GitHubLogoIcon className='h-5 w-5' />} delay={250}>
                            {loginWith} GitHub
                        </ProviderButton>
                        <ProviderButton href='/api/auth/login/microsoft' icon={<MicrosoftIcon />} delay={320}>
                            {loginWith} Microsoft
                        </ProviderButton>
                    </div>

                    <p
                        className='lt-rise mt-8 text-center text-xs leading-relaxed text-muted-foreground'
                        style={{ animationDelay: '400ms' }}
                    >
                        {terms}
                    </p>
                </div>
            </main>
        </div>
    )
}
