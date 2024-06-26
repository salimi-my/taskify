export function Footer() {
  return (
    <div className='z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-8 flex h-14 items-center'>
        <small className='text-muted-foreground'>
          © {new Date().getFullYear()} Taskify. Created by{' '}
          <a
            className='hover:underline'
            href='https://www.linkedin.com/in/mohamad-salimi'
            aria-label='Salimi'
            target='_blank'
            rel='noopener noreferrer'
          >
            Salimi
          </a>
          . All right reserved.
        </small>
      </div>
    </div>
  );
}
