@extends('layouts.app')

@section('title', 'Timesheets')

@section('content')
    <div id="timesheets-react-root"></div>
    @viteReactRefresh
    @vite('resources/js/timesheets.tsx')
@endsection
