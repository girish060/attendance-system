-- Allow users to insert their own profile during login if it doesn't exist
DROP POLICY IF EXISTS "Users can insert own profile on login" ON profiles;
CREATE POLICY "Users can insert own profile on login"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
