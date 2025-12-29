// Fix DATABASE_URL before any imports
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('postgresql://', 'postgres://');
  console.log('Converted DATABASE_URL protocol from postgresql:// to postgres://');
}
