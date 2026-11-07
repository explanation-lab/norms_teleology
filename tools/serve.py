"""Read-only localhost preview. No response collection or database."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=8776)
parser.add_argument('--directory', default=str(Path(__file__).resolve().parents[1] / 'code/experiments/study1'))
args = parser.parse_args()
server = ThreadingHTTPServer(('127.0.0.1', args.port), partial(SimpleHTTPRequestHandler, directory=args.directory))
print(f'Local: http://127.0.0.1:{args.port}/', flush=True)
server.serve_forever()
