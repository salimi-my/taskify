import Link from 'next/link';
import Image from 'next/image';

import Logo from '@public/taskify-logo.png';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='px-4 lg:px-6 h-14 flex items-center'>
        <Link
          href='/'
          className='flex justify-start items-center hover:opacity-85 transition-opacity duration-300'
        >
          <Image
            src={Logo}
            placeholder='blur'
            priority
            alt='Taskify Logo'
            className='w-7 h-7 mr-3'
          />
          <h1 className='flex justify-start items-center font-bold text-2xl text-primary'>
            Taskify
          </h1>
          <span className='sr-only'>Taskify</span>
        </Link>
        <nav className='ml-auto flex gap-4 sm:gap-6'>
          <Link
            className='text-sm font-medium hover:underline underline-offset-4'
            href='#features'
          >
            Features
          </Link>
          <Link
            className='text-sm font-medium hover:underline underline-offset-4'
            href='/auth/sign-in'
          >
            Sign In
          </Link>
        </nav>
      </header>
      <main className='flex-1'>
        <section className='w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]'>
              <div className='bg-neutral-100 dark:bg-neutral-800 mx-auto aspect-video overflow-hidden rounded-xl object-cover w-full lg:order-last lg:aspect-square' />
              <div className='flex flex-col justify-center space-y-4'>
                <div className='space-y-2'>
                  <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary'>
                    The complete platform <br />
                    for building the Web
                  </h1>
                  <p className='max-w-[600px] text-neutral-500 md:text-xl dark:text-neutral-400'>
                    Give your team the toolkit to stop configuring and start
                    innovating. Securely build, deploy, and scale the best web
                    experiences.
                  </p>
                </div>
                <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                  <Button variant='default' size='lg' asChild>
                    <Link href='#'>Get Started</Link>
                  </Button>
                  <Button variant='outline' size='lg' asChild>
                    <Link href='#'>Contact Sales</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id='features' className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <div className='inline-block rounded-lg bg-neutral-100 px-3 py-1 text-sm dark:bg-neutral-800'>
                  Key Features
                </div>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary'>
                  Faster iteration. More innovation.
                </h2>
                <p className='max-w-[900px] text-neutral-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-neutral-400'>
                  The platform for rapid progress. Let your team focus on
                  shipping features instead of managing infrastructure with
                  automated CI/CD.
                </p>
              </div>
            </div>
            <div className='mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-10'>
              <div className='mx-auto aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-xl object-cover object-center w-full lg:order-last' />
              <div className='flex flex-col justify-center space-y-4'>
                <ul className='grid gap-6'>
                  <li>
                    <div className='grid gap-1'>
                      <h3 className='text-xl font-bold text-primary'>
                        Collaboration
                      </h3>
                      <p className='text-neutral-500 dark:text-neutral-400'>
                        Make collaboration seamless with built-in code review
                        tools.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className='grid gap-1'>
                      <h3 className='text-xl font-bold text-primary'>
                        Automation
                      </h3>
                      <p className='text-neutral-500 dark:text-neutral-400'>
                        Automate your workflow with continuous integration.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className='grid gap-1'>
                      <h3 className='text-xl font-bold text-primary'>Scale</h3>
                      <p className='text-neutral-500 dark:text-neutral-400'>
                        Deploy to the cloud with a single click and scale with
                        ease.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className='w-full py-12 md:py-24 lg:py-32 border-t'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl text-primary'>
                  Sign Up for Updates
                </h2>
                <p className='max-w-[600px] text-neutral-500 md:text-xl dark:text-neutral-400'>
                  Stay updated with the latest product news and updates.
                </p>
              </div>
              <div className='w-full max-w-sm space-y-2'>
                <form className='flex sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2'>
                  <input
                    className='max-w-lg flex-1 px-4 py-2 border-border border rounded-md '
                    placeholder='Enter your email'
                    type='email'
                  />
                  <Button variant='default' size='lg' asChild>
                    <Link href='#'>Sign Up</Link>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className='flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t'>
        <p className='text-xs text-neutral-500 dark:text-neutral-400'>
          © {new Date().getFullYear()} Taskify. Created by{' '}
          <Button
            variant='link'
            className='text-xs px-0 text-neutral-500 dark:text-neutral-400'
            asChild
          >
            <Link
              href='https://www.salimi.my'
              target='_blank'
              rel='noopener noreferrer'
            >
              Salimi
            </Link>
          </Button>
          .
        </p>
        <nav className='sm:ml-auto flex gap-4 sm:gap-6'>
          <Link className='text-xs hover:underline underline-offset-4' href='#'>
            Terms of Service
          </Link>
          <Link className='text-xs hover:underline underline-offset-4' href='#'>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
