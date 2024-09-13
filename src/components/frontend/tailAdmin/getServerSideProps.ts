import fs from "fs/promises";
import { GetServerSideProps, NextPage } from "next";

import path from "path";

export const getServerSideProps: GetServerSideProps = async () => {
    const fs = (await import('fs/promises')).default;
    const path = (await import('path')).default;
    
    const props = { dirs: [] };
    try {
      const dirs = await fs.readdir(path.join(process.cwd(), "/public/images"));
      props.dirs = dirs as any;
      return { props };
    } catch (error) {
      return { props };
    }
  };
  