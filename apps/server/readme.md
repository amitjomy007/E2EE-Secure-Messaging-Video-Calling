# running prisma studio
cd apps/server
npx prisma studio

# Generate prisma before yarn dev
npx prisma generate

# i did this as well for cleanup
git rm -r --cached apps/server/src/generated
