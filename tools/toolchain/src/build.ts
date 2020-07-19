#!/usr/bin/env node
import { exec } from "./exec";

exec.rimraf("dist");
exec.tsc();
